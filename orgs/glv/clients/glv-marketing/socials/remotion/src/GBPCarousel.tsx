import React from "react";
import { Sequence } from "remotion";
import { brandGLV } from "./brand-glvbuilds";
import { SlideData } from "./types";
import { GBPSlide } from "./slides/GBPSlide";

interface Props {
  slides: SlideData[];
}

export const GBPCarousel: React.FC<Props> = ({ slides }) => {
  const total = slides.length;
  return (
    <>
      {slides.map((slide, i) => (
        <Sequence key={i} from={i * brandGLV.slideDuration} durationInFrames={brandGLV.slideDuration}>
          <GBPSlide slide={slide} slideIndex={i} totalSlides={total} />
        </Sequence>
      ))}
    </>
  );
};
