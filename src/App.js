import React, { Component } from "react";
import "./App.css";
import algoliasearch from "algoliasearch";

class App extends Component {
  constructor(props) {
    super(props);
    this.client = algoliasearch(
      "1WYSWXMAA0",
      "5eaad0af223d32c2631920ee7142502a"
    );
    this.index = this.client.initIndex("routedesvins");
    this.index.setSettings({
      searchableAttributes: ["nom", "email", "biography"]
    });

    this.search = this.search.bind(this);
  }

  search(e) {
    this.index.search(e.target.value, (err, content) => {
      console.log(content.hits);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <form action="#" className="form">
              <h3>Basic autocomplete.js example</h3>
              <input
                onChange={this.search}
                className="form-control"
                id="contacts"
                name="contacts"
                type="text"
                placeholder="Search by name"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
