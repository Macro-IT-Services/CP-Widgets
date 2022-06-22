import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useCallback } from 'react';

const useViewBox = stroke => {
  //  console.log(stroke)
  const svg = useRef();
  const [viewBox, setViewBox] = useState(undefined);

  const getViewBox = useCallback(() => {
    // if svg not mounted yet, exit
    if (!svg.current) return;
    // get bbox of content in svg
    const { x, y, width, height } = svg.current.getBBox();
    // notice that we should compensate stroke width to avoid clipping
    setViewBox(
      [
        x - (stroke >> 1),
        y - (stroke >> 1),
        width + stroke,
        height + stroke,
      ].join(' ')
    );
  }, []);

  useEffect(() => {
    getViewBox();
  });

  return [svg, viewBox];
};

export default useViewBox;
