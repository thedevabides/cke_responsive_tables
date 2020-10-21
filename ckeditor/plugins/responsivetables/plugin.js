/*
* A ckeditor plugin\
*/

(function($, Drupal, drupalSettings, CKEDITOR) {
  CKEDITOR.plugins.add('responsivetables', {
    init: function( editor ) {

      //// Event Listeners
      // Add classes for column colors on edit
      editor.on('toHtml', function ( evt ) {
        addTableClass(evt.data.dataValue, 'ckeditor-priority-collapse-table');
      }, null, null, 14);
      editor.on('toDataFormat', function ( evt ) {
           removeTableClass(evt.data.dataValue, 'ckeditor-priority-collapse-table');
      }, null, null, 14);

      editor.on('insertElement', function (evt) {
        if(evt.data.getName() == 'table') {
          evt.data.setAttribute('width', '');
          $(evt.data.$).addClass('ckeditor-priority-collapse-table');
          $(evt.data.$).addClass('responsive-enabled');
        }
      }, null, null, 14);

      // Add Dialog
      if ( editor.blockless )
        return;

      var config = editor.config,
        lang = editor.lang.format,
        collapseClasses = {};

      collapseClasses['priority-high'] = 'High priority';
      collapseClasses['priority-medium'] = 'Medium priority';
      collapseClasses['priority-low'] = 'Low priority';

      editor.ui.addRichCombo( 'CollapseTable', {
        label: 'Collapse Table',
        title: 'Collapse Table',

        panel: {
          css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
          multiSelect: false,
          attributes: { 'aria-label': lang.panelTitle }
        },

        init: function() {
          this.startGroup( 'Collapse Table' );
          for ( var className in collapseClasses ) {
            // Add the tag entry to the panel list.
            this.add( className, collapseClasses[ className ]);
          }
        },

        onClick: function( value ) {
          editor. focus();
          editor.fire( 'saveSnapshot' );

          var element = editor.getSelection().getStartElement(),
            elementPath = editor.elementPath();

          if (elementPath.contains('table')) {
            addTableClass(element, 'ckeditor-priority-collapse-table');
            addTableClass(element, 'responsive-enabled');

            var colIndex = $(element.$).parent().children().index($(element.$)) + 1,
              cTable = $(element.$).parent().parent().parent();

            $('th:nth-child(' + colIndex + '), td:nth-child(' + colIndex + ')', cTable).each(function () {
              removeClasses($(this));
              if(value) {
                $(this).addClass(value);
              }
            });
          }

          // Save the undo snapshot after all changes are affected. (https://dev.ckeditor.com/ticket/4899)
          setTimeout( function() {
            editor.fire( 'saveSnapshot' );
          }, 0 );
        },

        onRender: function() {
          editor.on( 'selectionChange', function( ev ) {
            var elementPath = ev.data.path;

            this.refresh();

            for ( var el in elementPath.elements ) {
              if( elementPath.elements[el].getName() == 'td' || elementPath.elements[el].getName() == 'th') {
                for ( var className in collapseClasses ) {
                  if (elementPath.elements[el].hasClass(className) ){
                    //this.setValue( collapseClasses[className] );
                      return;
                  }
                }
              }
            }

            // If no classes match, it is high priority however,
            // setting a default of high priority affects the disabled state
            // when not on a table, so just set it empty.
            this.setValue( '' );

          }, this );
        },

        onOpen: function() {
          this.showAll();
        },

        refresh: function() {
          var elementPath = editor.elementPath();

          if ( !elementPath )
            return;

          // Check if element path contains 'table' element.
          if ( !elementPath.contains('table') ) {
            this.setState( CKEDITOR.TRISTATE_DISABLED );
            return;
          }
        }

      });

      //// Helper Functions
      function addTableClass( element, className ) {
        var children = element.children;
        if (children) {
          for (var i = children.length; i--; ) {
            var child = children[i];
            if (child.name == 'table') {
              child.addClass(className)
            }
            addTableClass(child);
          }
        }
      }

      function removeTableClass( element, className ) {
        var children = element.children;
        if (children) {
          for (var i = children.length; i--; ) {
            var child = children[i];
            if (child.name == 'table') {
              child.removeClass(className)
            }
            removeTableClass(child);
          }
        }
      }

      function removeClasses( element ) {
        element.removeClass('priority-high');
        element.removeClass('priority-medium');
        element.removeClass('priority-low');
      }

    }
  });



})(jQuery, Drupal, drupalSettings, CKEDITOR);