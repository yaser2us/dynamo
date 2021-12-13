export default (data, indexA, indexB) => {
  data[indexA] = [data[indexB], (data[indexB] = data[indexA])][0];
};
