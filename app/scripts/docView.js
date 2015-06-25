/*global LookUp, Backbone*/
/*jshint globalstrict: true*/

'use strict';

LookUp.views.DocView = Backbone.View.extend({

    events: {
        'change .loadEpub': 'onFileSelect'
    },

    initialize: function (options) {
        this.appState = options.appState;

        this.listenTo(this.appState, 'change:book', this.onBookChange);
        this.listenTo(this.appState, 'change:toolbarsVisible', this.onToolbarsVisibleChange);
        this.listenTo(this.appState, 'change:zoom', this.onZoomChange);
    },

    onBookChange: function (appState, book) {
        book.getMetadata().then(function (meta) {
            console.log('meta: %o', meta);
            this.$el.find('.headerContainer h1').html(meta.bookTitle + '<span>' + meta.creator + '</span>');
        }.bind(this));

        book.ready.all.then(function () {
            $('#loader').hide();
        });

        book.renderTo('book');
    },

    onToolbarsVisibleChange: function (appState, toolbarsVisible) {
        this.$el.toggleClass('tb', !!toolbarsVisible);
    },

    onZoomChange: function (appState, zoom) {
        this.appState.get('book').setStyle('fontSize', zoom + 'px');
    },

    onFileSelect: function (e) {
        var file = e.target.files[0];
        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = function (e) {
                this.appState.set('customBookData', {
                    name: file.name,
                    data: e.target.result
                });
            }.bind(this);
            reader.readAsArrayBuffer(file);
        }
    }
});




