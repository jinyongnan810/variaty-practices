import Page from "@/app/page";
import "@testing-library/jest-dom";
import { cleanup, render } from "@testing-library/react";
afterEach(cleanup);

describe("Homepage Snapshot", () => {
  it("renders homepage unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
