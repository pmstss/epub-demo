/*global ePub, LookUp, Backbone*/
/*jshint globalstrict: true*/

'use strict';

LookUp.Router = Backbone.Router.extend({
    routes: {
        'custom/:bookName': 'routeCustomBook',
        'book/:bookName': 'routeBook',
        '*path': 'defaultRoute'
    },

    initialize: function () {
        this.appState = new LookUp.models.AppState();

        var $docView = $('#docView');

        new LookUp.views.DocView({
            appState: this.appState,
            el: $docView
        });

        new LookUp.views.DocPageNavigationView({
            el: $docView.find('.pageNavigationContainer'),
            appState: this.appState
        });

        new LookUp.views.DocTOCView({
            el: $docView.find('.toc'),
            appState: this.appState
        });

        new LookUp.views.DocToolsView({
            el: $docView.find('.tools'),
            appState: this.appState
        });

        new LookUp.views.DocFooterView({
            el: $('.pagesSliderContainer'),
            appState: this.appState
        });

        this.appState.on('change:customBookData', function (appState, customBookData) {
            if (customBookData) {
                this.navigate('custom/' + customBookData.name, {
                    trigger: true,
                    replace: true
                });
            }
        }.bind(this));
    },

    routeCustomBook: function () {
        var book = this.appState.get('book');
        if (book) {
            book.destroy();
        }

        var customBookData = this.appState.get('customBookData');
        if (customBookData) {
            this.appState.set('book', ePub({
                bookPath: customBookData.data
            }));
        } else {
            this.defaultRoute();
        }
    },

    routeBook: function (bookName) {
        var book = this.appState.get('book');
        if (book) {
            book.destroy();
        }

        bookName = /\.epub$/.test(bookName) ? bookName : bookName + '/';
        this.appState.set('book', ePub({
            bookPath: '../books/' + bookName
        }));
    },

    defaultRoute: function () {
        this.navigate('book/William_Shakespeare_Venus_and_Adonis.epub', {
            trigger: true,
            replace: true
        });
    }
});
