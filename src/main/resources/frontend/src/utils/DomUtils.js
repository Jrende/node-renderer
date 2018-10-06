export function getAllOffsetSizes(elm) {
  let offsetSize = [0, 0];
  // sic
  while(elm !== null) {
    if(elm.offsetLeft !== undefined) {
      offsetSize[0] += elm.offsetLeft;
      offsetSize[1] += elm.offsetTop;
    }
    elm = elm.parentElement;
  }
  return offsetSize;
}

