export function repeatElement(element, timesToRepeat) {
  return ([...Array(timesToRepeat).keys()].map(_ => element));
}
