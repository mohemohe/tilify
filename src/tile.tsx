import * as React from "react";
import { RGBColor } from "react-color";
import Canvas from "./canvas";
import { Img } from "./generator";

interface IProps {
  canvasComponentRef: React.Ref<Canvas>;
  backgroundColor: RGBColor;
  images: Img[];
}

interface IState extends React.ComponentState {}

export default class Tile extends React.Component<IProps, IState> {
  public render() {
    const { images, canvasComponentRef, backgroundColor } = this.props;
    const col = Math.ceil(Math.sqrt(images.length));
    const row = Math.round(Math.sqrt(images.length));
    const maxCellSize =
      images
        .map(image => image.size)
        .sort((a, b) => (a > b ? -1 : 1))
        .reverse()
        .pop() || 0;
    const canvasWidth = maxCellSize * col;
    const canvasHeight = maxCellSize * row;
    console.log("col:", col, "row:", row);

    return (
      <Canvas
        key={images.map(image => image.name).join("")}
        ref={canvasComponentRef}
        backgroundImage={""}
        width={canvasWidth}
        height={canvasHeight}
        updateCanvas={(context: CanvasRenderingContext2D) => {
          context.clearRect(0, 0, canvasWidth, canvasHeight);
          context.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a || 0})`;
          context.fillRect(0, 0, canvasWidth, canvasHeight);
          images.forEach(({ image }, index) => {
            var img = new Image();
            console.log("index:", index, "col:", index % col, "row:", Math.floor(index / col));
            img.onload = () => {
              context.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                maxCellSize * (index % col) + (maxCellSize - img.width) / 2,
                maxCellSize * Math.floor(index / col) + (maxCellSize - img.height) / 2,
                img.width,
                img.height
              );
            };
            img.src = image;
          });
        }}
      />
    );
  }
}
