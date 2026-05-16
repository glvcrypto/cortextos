import React from "react";
import { Sequence } from "remotion";
import { brandGLV } from "./brand-glvbuilds";
import { SlideData } from "./types";
import { GLVSlide } from "./slides/GLVSlide";

interface Props {
  slides: SlideData[];
}

export const GLVCarousel: React.FC<Props> = ({ slides }) => {
  const total = slides.length;
  return (
    <>
      {slides.map((slide, i) => (
        <Sequence key={i} from={i * brandGLV.slideDuration} durationInFrames={brandGLV.slideDuration}>
          <GLVSlide slide={slide} slideIndex={i} totalSlides={total} />
        </Sequence>
      ))}
    </>
  );
};
