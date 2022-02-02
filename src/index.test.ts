import * as I from "./index";

test("import/exports", () => {
  expect(typeof I.GraphQL).toEqual("function");
  expect(typeof I.Rest).toEqual("object");
  expect(typeof I.Rest.Commit).toEqual("object");
  expect(typeof I.Rest.Content).toEqual("object");
  expect(typeof I.Rest.Org).toEqual("object");
  expect(typeof I.Rest.Repo).toEqual("object");
  expect(typeof I.Rest.Utils).toEqual("object");
});
