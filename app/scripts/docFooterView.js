/*global LookUp, Backbone, Handlebars*/
/*jshint globalstrict: true, laxbreak: true*/

'use strict';

LookUp.views.DocFooterView = Backbone.View.extend({
    events: {
        'change input.currentPage': 'onCurrentPageUserChange',
        'keydown input.currentPage': 'onCurrentPageUserKeyChange',
        'mousedown .circle': 'dragStart'
    },

    templateFooterView: Handlebars.compile($('#templateFooterView').html()),

    initialize: function (options) {
        this.appState = options.appState;

        this.$el.html(this.templateFooterView());

        this.$spread = this.$el.find('.spread');
        this.$spread2 = this.$el.find('.spread2');
        this.$currentPageInput = this.$el.find('input.currentPage');
        this.$totalPages = this.$el.find('.totalPages');

        this.drag = null;
        this.$draggableItem = this.$el.find('.progress_scroll .circle');

        this.dragEndBinded = this.dragEnd.bind(this);
        this.doDragBinded = this.doDrag.bind(this);


        this.listenTo(this.appState, 'change:book', function (appState, book) {
            book.rendition.on('renderer:locationChanged', function () {
                console.log('renderer:locationChanged args: %o', arguments);
                setTimeout(this.onPageChange.bind(this), 200);
            }.bind(this));
        });
    },

    getPagesTotal: function () {
        //return this.appState.get('book').renderer.displayedPages;
        return this.appState.get('book').spine.length;
    },

    setPageNum: function (pageNum) {
        //this.appState.get('book').renderer.page(pageNum);
        this.appState.get('book').displayChapter(pageNum - 1);
    },

    getPageNum: function () {
        //return this.appState.get('book').renderer.chapterPos;
        return this.appState.get('book').spinePos + 1;
    },

    onPageChange: function () {
        var pageNum = this.getPageNum();
        this.$spread.html(pageNum);
        this.$spread2.hide();
        this.$spread.show();

        var totalPages = this.getPagesTotal();

        this.$draggableItem.css('left', 'calc(' + (pageNum - 1) / (totalPages - 1) * 100 + '%)');
        this.$currentPageInput.val(pageNum);
        this.$totalPages.html(this.getPagesTotal());
    },

    onCurrentPageUserChange: function (e) {
        var pageNum = $(e.target).val();
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= this.getPagesTotal()) {
            this.setPageNum(pageNum);
        } else {
            $(this).val(this.getPageNum());
        }
    },

    onCurrentPageUserKeyChange: function (e) {
        if ((e.keyCode || e.which) === 13) {
            var pageNum = $(e.target).val();
            if (!isNaN(pageNum) && pageNum > 0 && pageNum <= this.getPagesTotal()) {
                this.setPageNum(pageNum);
            } else {
                $(this).val(this.getPageNum());
            }
        }
    },

    dragStart: function (e) {
        if (!this.appState.get('book')) {
            return;
        }

        this.drag = {
            mouseStartX: e.clientX,
            total: this.$el.find('.line').width() - 26,
            elementStartPos: this.$draggableItem.position().left
        };

        this.updateDrag(this.drag.elementStartPos / this.drag.total * 100);

        $(document).bind('mouseup', this.dragEndBinded);
        $(document).bind('mousemove', this.doDragBinded);
    },

    dragEnd: function () {
        if (!this.drag) {
            return;
        }

        if (this.drag.pageNum) {
            this.setPageNum(this.drag.pageNum);
        }

        this.drag = null;

        $(document).unbind('mouseup', this.dragEndBinded);
        $(document).unbind('mousemove', this.doDragBinded);
    },

    doDrag: function (e) {
        if (this.drag) {
            this.updateDrag((this.drag.elementStartPos + e.clientX - this.drag.mouseStartX) / this.drag.total * 100);
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    },

    updateDrag: function (value) {
        if (value >= 0 && value <= 100) {
            var pageNum = Math.round((this.getPagesTotal() - 1) * value / 100) + 1;

            this.$draggableItem.css('left', value + '%');

            if (pageNum !== this.drag.pageNum) {
                this.drag.pageNum = pageNum;
            }
        }
    }
});
