import * as React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import Generator from "./generator";

interface IProps {}

interface IState extends React.ComponentState {}

export default class App extends React.Component<IProps, IState> {
  public render() {
    return (
      <div>
        <AppBar
          position="static"
          style={{
            marginBottom: "0.5rem"
          }}
        >
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Tilify sample
            </Typography>
          </Toolbar>
        </AppBar>
        <Generator />
      </div>
    );
  }
}
