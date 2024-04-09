/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from './NewsCarousel.module.scss';
import type { INewsCarouselProps } from './INewsCarouselProps';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/swiper-react';

import 'swiper/swiper-bundle.css';
import 'swiper/modules/navigation.css';
import 'swiper/modules/pagination.css';
import DOMPurify from 'dompurify';
import Handlebars from 'handlebars';
import { Link } from '@fluentui/react';



export interface INewsCarouselBreakPointSettings {
  slidesPerView: number;
  spaceBetween: number;
}

export interface INewsCarouselState {
  slides: Array<JSX.Element>;
  css: string;
  breakpoints: any;
}

export default class NewsCarousel extends React.Component<INewsCarouselProps, INewsCarouselState> {

  constructor(props: INewsCarouselProps) {
    super(props);

    this.state = {
      slides: [],
      css: "",
      breakpoints: []
    };
  }

  componentDidMount(): void {
    const { data, template, css, webPartId } = this.props;

    const slides = data.map((slide, index) => this.loadSlide(slide, template));
    const fixedCss = this.fixedCss(css, webPartId);

    const breakpoints = this.loadBreakPoints();
  
    this.setState({
      slides: slides,
      css: fixedCss,
      breakpoints: breakpoints
    });
  
}


  private loadBreakPoints(): {
    [width: number]: INewsCarouselBreakPointSettings;
    [ratio: string]: INewsCarouselBreakPointSettings;
  } {
    const { breakpoints } = this.props;

    // eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
   let breakPointTable: any = {};

    if(breakpoints) {
      breakpoints.forEach((breakpoint) => {
        // eslint-disable-next-line prefer-const
        breakPointTable[breakpoint.selector] =  { slidesPerView: parseInt(breakpoint.slidesPerView) as number, spaceBetween: parseFloat(breakpoint.spaceBetween) };    
      });
    }

    return breakPointTable;
  }


  private loadSlide(slide: { Title: string, Description: string, ImageUrl: string, Link: string; showImage: boolean }, handlbarsTemplate: string): React.ReactElement {
  const hbTemplate = Handlebars.compile(handlbarsTemplate);
  const htmlString: string = hbTemplate(slide);
  const sanitizedHTML: string = DOMPurify.sanitize(htmlString);

  const reactElement = <section className={styles.slideStyle} dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;

  return reactElement;


}

  private fixedCss(css: string, instanceId: string): string {
  /*

    /^(?<style>\.[\w\s]+) (?<styles>{[\s\S]*?})/gm
  */

  const tags = css.split("}");

  const mappedTags = tags.map((tag) => {
    if (tag) {
      console.log(tag.trim());
      if(tag.trim().startsWith(".carousel-container")) {
        return `#carousel-${instanceId.trim()}${tag.trim()} \n }`; 
      }
      else {
      return `#carousel-${instanceId.trim()} ${tag.trim()} \n }`;
      }
    }
    else {
      return "";
    }
  });

  return mappedTags.join('\n');
}


  public render(): React.ReactElement < INewsCarouselProps > {
  const {
    headerText,
    headerTextLink,
    height,
    webPartId,
    moreInformation,
    moreInformationLink,
    slidesPerView,
    delay
  } = this.props;
  const {
    slides,
    css,
    breakpoints
  } = this.state;

/**
 *  breakpoints={{
                  320: breakpoints[320] ? breakpoints[320] : {},
                  480: breakpoints[480] ? breakpoints[480] : {},
                  768: breakpoints[768] ? breakpoints[768] : {},
                  1024: breakpoints[1024] ? breakpoints[1024] : {},
                  1366: breakpoints[1366] ? breakpoints[1366] : {},
                  1920: breakpoints[1920] ? breakpoints[1920] : {},
                }}
 */


  return(
      <React.Fragment >
    { css && <style type="text/css">{css}</style>
}

  { slides && slides.length > 0 && < div id = {`carousel-${webPartId.trim()}`} className={`carousel-container`}>

          <div className={`${styles.headerStyle} header`}>
            { headerTextLink && headerText && <a href={headerTextLink}><h2 className={`headerText`}>{headerText}</h2></a>}
            { "" === headerTextLink && headerText && <h2 className={`headerText`}>{headerText}</h2>}
          </div>
          <div className={`${styles.newsCarousel} carousel`} style={{ minHeight: height }}>
            <Swiper
              slidesPerView={slidesPerView}
              spaceBetween={10}
              freeMode
              autoplay={delay > 0 ? {
                delay: delay,
                pauseOnMouseEnter: true
              } : undefined}
              loop
              pagination={{
                clickable: true,
              }}
              breakpoints={breakpoints}
              breakpointsBase='container'
              modules={[Pagination, Navigation, Autoplay]}
              navigation
              className={styles.swiper}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>{slide}</SwiperSlide>
              ))}

            </Swiper>
          </div>
          {moreInformationLink && moreInformation && 
            <div className={`${styles.newsCarouselFooter} carousel-footer`}>
              <Link className={`${styles.newsCarouselFooterLink} carousel-footer-link`} href={moreInformationLink} link={moreInformationLink}>{moreInformation}</Link>
            </div>
          }
        </div >}

      </React.Fragment >
    );
  }
}
