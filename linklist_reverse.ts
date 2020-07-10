class ListNode<T> {
  value: T
  next: ListNode<T>
  constructor (value: T, next: ListNode<T>) {
    this.value = value
    this.next = next
  }
}

function createList<T> (array: Array<T>): ListNode<T> {
  let list: ListNode<T> = null
  array.reverse().forEach(element => {
    list = new ListNode(element, list)
  })
  return list
}

function iterateList<T> (list: ListNode<T>, func: (element: T) => void) {
  for (let node = list; node != null; node = node.next) {
    func(node.value)
  }
}

function reverseList<T> (list: ListNode<T>): ListNode<T> {
  if (list == null) {
    return list
  }
  let result = list
  list = list.next
  result.next = null
  while (list != null) {
    const next = list.next
    list.next = result
    result = list
    list = next
  }
  return result
}

iterateList(createList([1, 2, 3, 4, 5]), console.log)
console.log('reverse:')
iterateList(reverseList(createList([1, 2, 3, 4, 5])), console.log)
console.log('null:')
iterateList(reverseList(new ListNode('a', null)), console.log)
