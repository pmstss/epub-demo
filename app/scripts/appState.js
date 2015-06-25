/*global LookUp, Backbone*/
/*jshint globalstrict: true*/

'use strict';

LookUp.models.AppState = Backbone.Model.extend({
    defaults: {
        book: null,
        toolbarsVisible: true,
        fullscreen: false,
        wordsMode: false,
        zoom: 16,
        customBookData: null
    },

    initialize: function () {
        this.ZOOM_MIN = 4;
        this.ZOOM_MAX = 72;
        this.ZOOM_DEFAULT = 16;
    },

    zoomIn: function () {
        var zoom = this.get('zoom');
        if (zoom < this.ZOOM_MAX) {
            this.set('zoom', zoom + 1);
            return true;
        }
        return false;
    },

    zoomOut: function () {
        var zoom = this.get('zoom');
        if (zoom > this.ZOOM_MIN) {
            this.set('zoom', zoom - 1);
            return true;
        }
        return false;
    },

    resetZoom: function () {
        this.set('zoom', this.ZOOM_DEFAULT);
    }
});
