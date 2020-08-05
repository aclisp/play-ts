class ListNode<T> {
  value: T
  next: ListNode<T>
  constructor (value: T, next: ListNode<T>) {
    this.value = value
    this.next = next
  }
}

function createList<T> (array: T[]): ListNode<T> {
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
  let result: ListNode<T> = null
  while (list != null) {
    const next = list.next
    list.next = result
    result = list
    list = next
  }
  return result
}

function reverseList2<T> (list: ListNode<T>): ListNode<T> {
  let result: ListNode<T> = null
  while (list != null) {
    const temp = list
    list = list.next
    temp.next = result
    result = temp
  }
  return result
}

function output<T> (element: T) {
  process.stdout.write(`${element} `)
}

[reverseList, reverseList2].forEach(reverse => {
  output('origin : ')
  iterateList(createList([1, 2, 3, 4, 5, 6]), output)
  console.log()

  output('reverse: ')
  iterateList(reverse(createList([1, 2, 3, 4, 5, 6])), output)
  console.log()

  output('null   : ')
  iterateList(reverse(new ListNode('a', null)), output)
  console.log()
})

// https://leetcode-cn.com/problems/reverse-linked-list/comments/
