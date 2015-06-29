/*global LookUp, Backbone*/
/*jshint globalstrict: true*/

'use strict';

LookUp.views.DocView = Backbone.View.extend({
    initialize: function (options) {
        this.appState = options.appState;

        this.listenTo(this.appState, 'change:book', this.onBookChange);
        this.listenTo(this.appState, 'change:toolbarsVisible', this.onToolbarsVisibleChange);
        this.listenTo(this.appState, 'change:zoom', this.onZoomChange);
    },

    onBookChange: function (appState, book) {
        book.loaded.metadata.then(function () {
            $('#loader').hide();
        });

        var rendition = book.renderTo('book');
        //TODO ###
        var displayed = rendition.display(1);
    },

    onToolbarsVisibleChange: function (appState, toolbarsVisible) {
        this.$el.toggleClass('tb', !!toolbarsVisible);
    },

    onZoomChange: function (appState, zoom) {
        this.appState.get('book').setStyle('fontSize', zoom + 'px');
    }
});




