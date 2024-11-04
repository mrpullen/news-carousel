/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  PropertyPaneTextField,
  type IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import NewsCarousel from './components/NewsCarousel';
import { INewsCarouselProps } from './components/INewsCarouselProps';

import { PropertyFieldCodeEditor, PropertyFieldCodeEditorLanguages } from '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor';

import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldNumber, PropertyFieldSliderWithCallout } from '@pnp/spfx-property-controls';

export interface INewsCarouselWebPartProps {
  slideBody: string;
  slideData: Array<any>;
  height: number;
  css: string;
  headerText: string;
  headerTextLink: string;
  webPartId: string;
  breakpoints: Array<{selector:number, slidesPerView: string, spaceBetween: string}>;
  moreInformation: string;
  moreInformationLink: string;
  slidesPerView: number;
  breakpointsJson: any;
  timeBetweenSlides: number;
}

export default class NewsCarouselWebPart extends BaseClientSideWebPart<INewsCarouselWebPartProps> {

  
  private onCodeChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if ("slideBody" === propertyPath) { 
      this.properties.slideBody = newValue;
      this.render();
    }
    if("breakpointsJson" === propertyPath) {
      this.properties.breakpointsJson = newValue;
    }
    if("css" === propertyPath) {
      this.properties.css = newValue;
    }
    this.render();
  }

  public render(): void {

    if(this.properties.slideBody && this.properties.slideData && this.properties.slideData.length > 0) {
    const element: React.ReactElement<INewsCarouselProps> = React.createElement(
      NewsCarousel,
      {
        webPartId: this.context.instanceId.trim(),
        headerText: this.properties.headerText ? this.properties.headerText : "Header",
        headerTextLink: this.properties.headerTextLink ? this.properties.headerTextLink : "",
        template: this.properties.slideBody ? this.properties.slideBody : "<div>{{Title}}</div>",
        data: this.properties.slideData,
        height: this.properties.height ? this.properties.height : 150,
        css: this.properties.css ? this.properties.css : ".grid { display:flex; }",
        breakpoints: this.properties.breakpoints,
        moreInformation: this.properties.moreInformation,
        moreInformationLink: this.properties.moreInformationLink,
        slidesPerView: this.properties.slidesPerView,
        delay: this.properties.timeBetweenSlides ? this.properties.timeBetweenSlides : 0
      }
    );

      ReactDom.render(element, this.domElement);
    }
    
  }



  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Settings"
          },
          groups: [
            {
              groupName: "Slide Settings",
              groupFields: [
                PropertyPaneTextField("headerText", {
                  label: "Header Text"
                }),
                PropertyPaneTextField("moreInformation", {
                  label: " Show More Information Text"
                }),
                PropertyPaneTextField("moreInformationLink", {
                  label: " Show More Information Link"
                }),
                
                PropertyPaneTextField("headerTextLink", {
                  label: "Header Text Link"
                }),
                PropertyFieldNumber("slidesPerView", {
                  key: 'slidesPerViewId',
                  label: "Slides per View",
                  minValue: 1,
                  maxValue: 10,
                  value: this.properties.slidesPerView
                }),
                PropertyFieldCollectionData("slideData", {
                  key: "collectionData",
                  label: "Slide Data",
                  panelHeader: "Slide Data",
                  manageBtnLabel: "Manage Slide data",
                  value: this.properties.slideData,
                  fields: [
                    {
                      id: "Title",
                      title: "Title",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "TitleColor",
                      title: "Title Color",
                      type: CustomCollectionFieldType.color,
                      defaultValue: "#000000",
                      required: true
                    },
                    {
                      id: "Description",
                      title: "Description",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "ImageUrl",
                      title: "ImageUrl",
                      type: CustomCollectionFieldType.string,
                      required: false
                    },
                    {
                      id: "LinkText",
                      title: "Link Text",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "Link",
                      title: "Link",
                      type: CustomCollectionFieldType.string,
                      required: true,
                    },
                    {
                      id: "LinkAltText",
                      title: "Link Alt Lext",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "ShowImage",
                      title: "ShowImage",
                      type: CustomCollectionFieldType.boolean,
                      defaultValue: true
                    },
                    {
                      id: "SecondLink",
                      title: "Second Link",
                      type: CustomCollectionFieldType.string,
                      required: false
                    },
                    {
                      id: "SecondLinkText",
                      title: "Second Link Text",
                      type: CustomCollectionFieldType.string,
                      required: false
                    },
                    {
                      id: "SecondLinkAltText",
                      title: "Second Link Alt Text",
                      type: CustomCollectionFieldType.string,
                      required: false
                    }
                    
                  ],
                  disabled: false
                }),
                PropertyFieldCodeEditor('slideBody', {
                  label: 'Edit Slide Body Code',
                  panelTitle: 'Edit Slide Body Code',
                  initialValue: this.properties.slideBody ? this.properties.slideBody : "<div>{{Title}}</div>",
                  onPropertyChange: this.onCodeChanged.bind(this),
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.Handlebars,
                  options: {
                    wrap: true,
                    fontSize: 20,
                    // more options
                  }
                }),
                PropertyFieldCodeEditor('css', {
                  label: 'Edit css Code',
                  panelTitle: 'Editcss Code',
                  initialValue: this.properties.css ? this.properties.css : `
                  .grid { 

                  }
                  
                  .header {
                    background: rgb(2,0,36);
                    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,8,115,1) 32%, rgba(9,9,121,0.7114495456385679) 71%, rgba(0,212,255,1) 100%);
                  
                  }
                  
                  .header > h2 {
                    color:white;
                    font-weight:600;
                  }
                  
                  `,
                  onPropertyChange: this.onCodeChanged.bind(this),
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldCSSId',
                  language: PropertyFieldCodeEditorLanguages.css,
                  options: {
                    wrap: true,
                    fontSize: 20,
                    // more options
                  }
                }),
                PropertyFieldNumber("height", {
                  key: "height",
                  label: "Swiper Height",
                  description: "Sets the height of the swiper control",
                  value: this.properties.height ? this.properties.height : 150,
                  minValue: 50,
                  
                  disabled: false
                }),
                PropertyFieldSliderWithCallout("timeBetweenSlides", {
                  key: 'timeBetweenSlidesId',
                  min: 0,
                  max: 30000
                }),
                PropertyFieldCollectionData("breakpoints", {
                  key: "breakpointsCollectionData",
                  label: "Breakpoints Data",
                  panelHeader: "Breakpoints Data",
                  manageBtnLabel: "Manage breakpoints",
                  value: this.properties.breakpoints,             
                  fields: [
                    {
                      id: "selector",
                      title: "Selector",
                      type: CustomCollectionFieldType.number,
                      required: true,
                      defaultValue: "@0.50"
                    },
                    {
                      id: "slidesPerView",
                      title: "Slides Per View",
                      type: CustomCollectionFieldType.number,
                      required: true,
                      
                    },
                    {
                      id: "spaceBetween",
                      title: "Space Between",
                      type: CustomCollectionFieldType.number,
                      required: false
                    }
                  ],
                  disabled: false
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}