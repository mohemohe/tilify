import * as React from "react";
import { Paper, Typography, Button, Fab } from "@material-ui/core";
import { SketchPicker, RGBColor } from "react-color";
import Tile from "./tile";
import Canvas from "./canvas";

interface IProps {}

interface IState extends React.ComponentState {
  images: Img[];
  backgroundColor: RGBColor;
}

export interface Img {
  name: string;
  image: string;
  size: number;
}

const styles = {
  root: {
    display: "flex",
    paddingLeft: "0.5rem"
  },
  paper: {
    margin: "0 0.5rem 0.5rem 0",
    padding: "0.5rem"
  }
};

export default class Generator extends React.Component<IProps, IState> {
  private canvasComponentRef: React.Ref<Canvas>;

  constructor(props: IProps, state: IState) {
    super(props, state);

    this.state = {
      images: [],
      backgroundColor: {
        r: 255,
        g: 0,
        b: 255,
        a: 1
      }
    };

    this.canvasComponentRef = React.createRef();
  }

  public render() {
    return (
      <div style={styles.root}>
        <div>
          <Paper style={styles.paper}>
            <Typography variant="h5" component="h3">
              背景色
            </Typography>
            <SketchPicker
              color={this.state.backgroundColor}
              onChangeComplete={color =>
                this.setState({
                  backgroundColor: color.rgb
                })
              }
            />
          </Paper>
        </div>
        <div>
          <Paper style={styles.paper}>
            <Typography variant="h5" component="h3">
              画像
            </Typography>
            <Button variant="contained" component="label" color="primary">
              開く
              <input
                style={{ display: "none" }}
                type="file"
                multiple
                accept="image/*"
                onClick={event => {
                  event.currentTarget.value = "";
                }}
                onChange={event => {
                  if (event.target.files) {
                    Array.from(event.target.files).forEach(file => {
                      const imageUrl = window.URL.createObjectURL(file) || "";
                      const image = new Image();
                      image.onload = () => {
                        const { width, height } = image;
                        const maxCellSize = width > height ? width : height;
                        const images = this.state.images;
                        images.push({
                          name: file.name,
                          image: imageUrl,
                          size: maxCellSize
                        });
                        this.setState({
                          images
                        });
                      };
                      image.src = imageUrl;
                    });
                  }
                }}
              />
            </Button>
            {this.state.images.map((image, index) => (
              <div style={{ marginLeft: "0.5rem" }}>
                <Fab
                  style={{
                    width: 24,
                    height: 24,
                    minHeight: 24,
                    marginRight: "0.5rem"
                  }}
                  onClick={() => {
                    if (index !== 0) {
                      const images = this.state.images;
                      images[index] = [images[index - 1], (images[index - 1] = images[index])][0];
                      this.setState({
                        images
                      });
                    }
                  }}
                >
                  <span role="img" aria-label="up">
                    👆
                  </span>
                </Fab>
                <Fab
                  style={{
                    width: 24,
                    height: 24,
                    minHeight: 24,
                    marginRight: "0.5rem"
                  }}
                  onClick={() => {
                    if (index !== this.state.images.length - 1) {
                      const images = this.state.images;
                      images[index] = [images[index + 1], (images[index + 1] = images[index])][0];
                      this.setState({
                        images
                      });
                    }
                  }}
                >
                  <span role="img" aria-label="up">
                    👇
                  </span>
                </Fab>
                {image.name}
                <Fab
                  color="secondary"
                  style={{
                    width: 24,
                    height: 24,
                    minHeight: 24,
                    marginRight: "0.5rem"
                  }}
                  onClick={() => {
                    const images = this.state.images.filter((img, idx) => {
                      if (idx === index) {
                        window.URL.revokeObjectURL(img.image);
                      }
                      return idx !== index;
                    });
                    this.setState({
                      images
                    });
                  }}
                >
                  −
                </Fab>
              </div>
            ))}
          </Paper>
          <Paper
            style={{
              padding: 0,
              margin: 0,
              overflow: "hidden",
              display: "flex",
              width: "fit-content"
            }}
          >
            <Tile canvasComponentRef={this.canvasComponentRef} backgroundColor={this.state.backgroundColor} images={this.state.images} />
          </Paper>
          <Button
            variant="contained"
            component="label"
            color="primary"
            style={{ marginTop: "0.5rem" }}
            onClick={() => {
              (this.canvasComponentRef as any).current.saveImage("tile");
            }}
          >
            ダウンロード
          </Button>
        </div>
      </div>
    );
  }
}
