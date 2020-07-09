var ListNode = /** @class */ (function () {
    function ListNode(value, next) {
        this.value = value;
        this.next = next;
    }
    return ListNode;
}());
function createList(array) {
    var list = null;
    array.reverse().forEach(function (element) {
        list = new ListNode(element, list);
    });
    return list;
}
function iterateList(list, func) {
    for (var node = list; node != null; node = node.next) {
        func(node.value);
    }
}
function reverseList(list) {
    if (list == null) {
        return list;
    }
    var result = list;
    list = list.next;
    result.next = null;
    while (list != null) {
        var next = list.next;
        list.next = result;
        result = list;
        list = next;
    }
    return result;
}
iterateList(createList([1, 2, 3, 4, 5]), console.log);
console.log('reverse:');
iterateList(reverseList(createList([1, 2, 3, 4, 5])), console.log);
console.log('null:');
iterateList(reverseList(new ListNode('a', null)), console.log);
//# sourceMappingURL=linklist_reverse.js.map