function bubbleSort<T> (array: T[]) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - 1; j++) {
      if (array[j] > array[j + 1]) {
        const temp = array[j]
        array[j] = array[j + 1]
        array[j + 1] = temp
      }
    }
  }
}

const a = [5, 4, 3, 2, 1]
bubbleSort(a)
console.log(a)
