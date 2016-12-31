for(var i = 0; i< 10; i++) {
    db.blogs.insert({
    title: i + '这是一个标题哦哦哦哦',
    remark: i + '概要这里有简介简介简介要长一点但是还不够长怎么办呢，没办法，只好复制复制啦，这里有简介简介简介要长一点这里有简介简介简介要长一点',
    content: i + 'lalallalalalal',
    author: 'UgliFan',
    top: false,
    reply_count: 20,
    visit_count: 999999,
    zan_count: 777,
    create_at: 1483211121168,
    last_reply: 'UgliFan',
    last_reply_at: 1483211121168,
    isOff: i % 2 === 0
    })
}
