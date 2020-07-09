class ListNode {
  value: any
  next: ListNode
  constructor (value: any, next: ListNode) {
    this.value = value
    this.next = next
  }
}

function createList (array: Array<any>): ListNode {
  let list: ListNode = null
  array.reverse().forEach(element => {
    list = new ListNode(element, list)
  })
  return list
}

function iterateList (list: ListNode, func: (element: any) => void) {
  for (let node = list; node != null; node = node.next) {
    func(node.value)
  }
}

function reverseList (list: ListNode): ListNode {
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
