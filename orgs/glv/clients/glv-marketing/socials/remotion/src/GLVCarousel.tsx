import React from "react";
import { Sequence } from "remotion";
import { brandGLV } from "./brand-glvbuilds";
import { SlideData } from "./types";
import { GLVSlide } from "./slides/GLVSlide";

interface Props {
  slides: SlideData[];
  brand?: typeof brandGLV;
}

export const GLVCarousel: React.FC<Props> = ({ slides, brand = brandGLV }) => {
  const total = slides.length;
  return (
    <>
      {slides.map((slide, i) => (
        <Sequence key={i} from={i * brand.slideDuration} durationInFrames={brand.slideDuration}>
          <GLVSlide slide={slide} slideIndex={i} totalSlides={total} brand={brand} />
        </Sequence>
      ))}
    </>
  );
};
