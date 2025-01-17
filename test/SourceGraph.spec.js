const expect = require("unexpected");
const SourceGraph = require("../lib/SourceGraph");
const path = require("path");

const resolveFixture = name => path.resolve(__dirname, "../fixtures", name);

describe("SourceGraph", () => {
  it("should be a constructor", () => {
    const sourceGraph = new SourceGraph();

    expect(sourceGraph, "to be an", SourceGraph);
  });

  describe("fixtures", () => {
    it("should load the simple fixture", async () => {
      const fixturePath = resolveFixture("simple");
      const sourceGraph = new SourceGraph(fixturePath);

      // pass the list of test files mocha would run to populate
      await sourceGraph.populate([
        path.resolve(fixturePath, "test/bar.spec.js")
      ]);

      await expect(sourceGraph, "to satisfy", {
        files: [
          { path: path.resolve(fixturePath, "test/bar.spec.js") },
          { path: path.resolve(fixturePath, "bar.js") },
          { path: path.resolve(fixturePath, "foo.js") }
        ]
      });

      await expect(
        sourceGraph.query({
          type: "relations",
          to: path.resolve(fixturePath, "foo.js")
        }),
        "to satisfy",
        [
          {
            from: path.resolve(fixturePath, "bar.js"),
            to: path.resolve(fixturePath, "foo.js")
          }
        ]
      );

      await expect(
        sourceGraph.query({
          type: "relations",
          to: path.resolve(fixturePath, "bar.js")
        }),
        "to satisfy",
        [
          {
            from: path.resolve(fixturePath, "test/bar.spec.js"),
            to: path.resolve(fixturePath, "bar.js")
          }
        ]
      );
    });

    it("should list incoming relations", async () => {
      const fixturePath = resolveFixture("simple");
      const sourceGraph = new SourceGraph(fixturePath);

      // pass the list of test files mocha would run to populate
      await sourceGraph.populate([
        path.resolve(fixturePath, "test/bar.spec.js")
      ]);

      const file = sourceGraph.query({
        type: "file",
        path: path.resolve(fixturePath, "foo.js")
      });

      return expect(file.incomingRelations, "to satisfy", [
        { from: path.resolve(fixturePath, "bar.js") }
      ]);
    });
  });
});
