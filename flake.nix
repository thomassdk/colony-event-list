{
  description = "A devShell example";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in with pkgs; {
        devShell = mkShell {
          buildInputs = [
            # Order matters
            # https://discourse.nixos.org/t/why-am-i-getting-an-older-version-of-npm-when-i-have-nodejs/16015
            nodePackages.npm
            nodejs-14_x
          ];
        };
      });
}
