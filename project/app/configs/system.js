module.exports = {
    prefixAdmin: 'admin',
    prefixNews: 'news',
    env: 'dev', // dev production
    format_long_time: 'HH:mm DD-MM-YYYY',
    status_value: [
        {id: 'novalue', name: '- Select status -'},
        {id: 'active', name: 'Active'},
        {id: 'inactive', name: 'Inactive'}
    ],
    // input_value: [
    //     {type: "text", id:"form[name]", name: "name" },
    //     {type:"number", id:"form[ordering]", name:"ordering"  },
    //     {type:"hidden", id:"form[token]", name:"id"  }
    // ]
}
