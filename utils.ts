const optionsUtils = {
  splitString: "|||",
  split: function (optionString: string) {
    const res = optionString.split(this.splitString);
    return res;
  },
  join: function (optionsArray: string[]) {
    return optionsArray.join(this.splitString);
  },
};

export { optionsUtils };
