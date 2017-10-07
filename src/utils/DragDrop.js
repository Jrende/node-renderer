import './animation.less';
let lastPos = [0, 0]
let drag = undefined;
function getDelta(pos) {
  let delta = [
    pos[0] - lastPos[0],
    pos[1] - lastPos[1]
  ];
  lastPos = pos;
  return delta;
}

document.addEventListener("mousemove", function(event) {
  let delta = getDelta([event.clientX, event.clientY]);
  if(event.buttons === 0 && drag) {
    deselectElement(drag.element);
  }

  if(drag) {
    let currentElement = drag.element;
    let left = currentElement.style.left;
    let top = currentElement.style.top;
    left = left.substring(0, left.length - 2)|0;
    top = top.substring(0, top.length - 2)|0;
    currentElement.style.left = (left + delta[0]) + "px";
    currentElement.style.top = (top + delta[1]) + "px";
  }
});

document.addEventListener("mouseup", function(event) {
  if(drag != undefined) {
    let target = document.elementFromPoint(event.clientX, event.clientY);
    let newEvent = new CustomEvent('drop', {detail: drag.data});
    newEvent.clientX = lastPos[0];
    newEvent.clientY = lastPos[1];
    target.dispatchEvent(newEvent);
    deselectElement(drag.element, target instanceof SVGSVGElement);
  }
});

function deselectElement(element, instant=false) {
  if(!instant) {
    element.classList.add("dragRebound");
  }
  element.classList.remove("dragging");
  element.style.left = "0px";
  element.style.top = "0px";
  drag = undefined;
}

function selectElement(newDrag) {
  drag = newDrag;
  drag.element.classList.add("dragging");
}

export default function draggable(element, data) {
  if(element == undefined) {
    return;
  }
  element.classList.add("draggable");

  element.addEventListener("mousedown", function(event) {
    selectElement({element, data});
  });

  element.addEventListener("transitionend", function() {
    element.classList.remove("dragRebound");
  });
}
