import * as React from "react";

interface IProps {
  width: number;
  height: number;
  updateCanvas: (context: CanvasRenderingContext2D) => void;
  backgroundImage: string;
}

interface IState extends React.ComponentState {
  image?: HTMLImageElement;
}

export default class Canvas extends React.Component<IProps, IState> {
  private canvas: HTMLCanvasElement | undefined;
  private blob: string = "";

  public componentDidMount() {
    this.updateCanvas();
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (this.props !== nextProps) {
      let shouldClear = false;
      if (this.props.backgroundImage !== nextProps.backgroundImage) {
        shouldClear = true;
        const image = new Image();
        image.src = nextProps.backgroundImage;
        image.onload = () => {
          this.setState(
            {
              image
            },
            () => {
              this.updateCanvas(shouldClear);
            }
          );
        };
      } else {
        this.updateCanvas(shouldClear);
      }
    }
  }

  public componentDidUpdate() {
    this.updateCanvas();
  }

  public updateCanvas(shouldClear: boolean = false) {
    if (!this.canvas) {
      return;
    }
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    if (shouldClear) {
      context.clearRect(0, 0, this.props.width, this.props.height);
    }

    if (this.props.backgroundImage) {
      const image = new Image();
      image.src = this.props.backgroundImage;
      context.drawImage(image, 0, 0, 512, 512);
      context.clearRect(0, 450, 512, 512 - 450);
    }
    this.props.updateCanvas(context);
  }

  public saveImage(baseName: string) {
    if (!this.canvas) {
      return;
    }
    try {
      window.URL.revokeObjectURL(this.blob);
    } catch (e) {}
    this.canvas.toBlob(blob => {
      this.blob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `${baseName.split(".")[0]}.generated.png`;
      a.href = this.blob;
      a.click();
    });
  }

  public render() {
    return (
      <canvas
        {...this.props}
        ref={element => {
          if (element) {
            this.canvas = element;
          }
        }}
      />
    );
  }
}
