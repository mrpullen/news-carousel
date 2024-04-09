export interface INewsCarouselProps {
  template: string;
  data: Array<{Title:string, Description: string, ImageUrl: string, Link: string; showImage: boolean}>;
  height: number;
  css: string;
  headerText: string;
  headerTextLink: string;
  webPartId: string;
  moreInformation: string;
  moreInformationLink: string;
  breakpoints: Array<{selector:number, slidesPerView: string, spaceBetween: string}>;
  slidesPerView: number;
  delay: number;

}
