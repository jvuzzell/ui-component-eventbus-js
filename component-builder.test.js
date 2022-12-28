import {screen} from '@testing-library/dom'; 
import userEvent from '@testing-library/user-event';

import { EventBus, GlobalComponentEvents } from './component-builder-and-event-bus/EventBus.js';  
import { ComponentBuilder as Builder, ComponentConfigs, ComponentProps } from './component-builder-and-event-bus/ComponentBuilder.js'; 
 
beforeEach(() => { 

});

afterEach(() => {

}); 

var sampleModule1 = function(
    Builder,
    ComponentConfigs,
){

    // State of individual modules
    var initialState = {
        componentName : 'sampleComponent1', 
        heading : 'Hello World'
    };

    // Return registered module (object) to developer
    ComponentConfigs.sampleComponent1 = {

        eventBus : [ 'GlobalComponentEvents' ],
        state : initialState, 
        props : {
            eventListeners : {
                updateHeading : {
                    onChangeFormInput : {
                        eventInit : ( moduleKey, module ) => {
                            let inlineTemplateNode = module.get.inlineTemplateNode(); 
                            inlineTemplateNode.querySelector( '[data-update-heading]' ).addEventListener( 'keyup', function(event){
                                module.dispatch.commitHeading( event.target.value );
                            });
                        }
                    }
                }
            }
        },
        hooks : {

            onMount : function( state ) { this.parent().dispatch.insertTemplate( '#app', 'append' ); }, 
            onUpdate : function( state ) {   
                if( !this.parent().get.state( 'firstRenderFlag' ) ) { 
                    let key = this.parent().get.state( 'key' );
                    this.parent().dispatch.updateHeading( document.querySelector( `[data-key="${key}"]` ) );
                }
            }

        },  
        dispatch : {

            /**
             * getTemplateNode 
             */ 
            getTemplateNode : function() {

                return this.createInlineTemplate( 
                    ComponentConfigs[ this.parent().get.state( 'componentName' ) ][ 'template' ], 
                    this.parent().get.state( 'key' )
                );

            }, 

            /**
             * appendTemplate 
             * @param selector (string)    query selector
             * @param insertType (string)  values append or prepend
             */
            insertTemplate : function( selector, insertType = 'append' ) {

                let templateNode = this.getTemplateNode();
                let documentNode = document.querySelector( selector );
                this.updateHeading( templateNode );

                switch( insertType ) {
                    case 'append' :  
                        documentNode.appendChild( templateNode );                                
                        break; 
                    case 'prepend' : 
                        documentNode.prependChild( templateNode );
                        break;
                    default : 
                        documentNode.appendChild( templateNode );
                        break;
                }

            }, 
            
            /**
             * commitHeading
             * @param inputValue (string)
             */
                commitHeading : function( inputValue ) {
                this.parent().commit.state({ 'heading' : inputValue });
            },

            /**
             * updateHeading
             * @param templateNode (node)
             */
            updateHeading : function( templateNode ) { 
                templateNode.querySelector( '[data-heading]' ).innerHTML = this.parent().get.state( 'heading' );
            },

        },
        template : `
            <div>
                <h1 data-heading></h1>
                <form>
                    <input data-update-heading type="text"/>
                </form>
            </div>
        `
        
    }

    Builder.registerComponent( ComponentConfigs.sampleComponent1 );

}