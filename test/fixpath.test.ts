import process from "node:process";
import { fixPath, fixPathSync } from "../src";
import {
  fixPath as fixPathEsm,
  fixPathSync as fixPathEsmSync,
} from "../dist/esm";
import {
  fixPath as fixPathCjs,
  fixPathSync as fixPathCjsSync,
} from "../dist/cjs";
import { beforeEach, it } from "vitest";

process.env.PATH = "/usr/local/bin";
const originalPath = String(process.env.PATH);

describe("Fix path", () => {
  beforeEach(() => {
    process.env.PATH = originalPath;
  });

  describe("sync", () => {
    it("properly parses process.env sync", ({ expect }) => {
      fixPathSync();
      const newPath = process.env.PATH;
      expect(newPath).not.toEqual(originalPath);
    });
    it("properly parses process.env - dist/esm sync", ({ expect }) => {
      fixPathEsmSync();
      const newPath = process.env.PATH;
      expect(newPath).not.toEqual(originalPath);
    });
    it("properly parses process.env - dist/cjs sync", ({ expect }) => {
      fixPathCjsSync();
      const newPath = process.env.PATH;
      expect(newPath).not.toEqual(originalPath);
    });
  });

  describe("async", () => {
    it("properly parses process.env async", async ({ expect }) => {
      await fixPath();
      const newPath = process.env.PATH;
      expect(newPath).not.toEqual(originalPath);
    });
    it("properly parses process.env - dist/esm async", async ({ expect }) => {
      await fixPathEsm();
      const newPath = process.env.PATH;
      expect(newPath).not.toEqual(originalPath);
    });
    it("properly parses process.env - dist/cjs async", async ({ expect }) => {
      await fixPathCjs();
      const newPath = process.env.PATH;
      expect(newPath).not.toEqual(originalPath);
    });
  });
});
