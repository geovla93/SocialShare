module.exports = {
    "scalars": [
        1,
        2,
        3,
        7,
        9,
        10
    ],
    "types": {
        "Comment": {
            "createdAt": [
                3
            ],
            "id": [
                1
            ],
            "post": [
                6
            ],
            "postId": [
                2
            ],
            "text": [
                2
            ],
            "updatedAt": [
                3
            ],
            "user": [
                12
            ],
            "userId": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "ID": {},
        "String": {},
        "DateTime": {},
        "Like": {
            "createdAt": [
                3
            ],
            "id": [
                1
            ],
            "post": [
                6
            ],
            "postId": [
                2
            ],
            "updatedAt": [
                3
            ],
            "user": [
                12
            ],
            "userId": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Mutation": {
            "deleteComment": [
                2,
                {
                    "commentId": [
                        2,
                        "String!"
                    ],
                    "postId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "deletePost": [
                2,
                {
                    "postId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "likePost": [
                4,
                {
                    "postId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "signUp": [
                12,
                {
                    "image": [
                        2
                    ],
                    "user": [
                        11,
                        "SignUpInput!"
                    ]
                }
            ],
            "submitComment": [
                2,
                {
                    "postId": [
                        2,
                        "String!"
                    ],
                    "text": [
                        2,
                        "String!"
                    ]
                }
            ],
            "submitPost": [
                6,
                {
                    "image": [
                        2
                    ],
                    "location": [
                        2
                    ],
                    "text": [
                        2,
                        "String!"
                    ]
                }
            ],
            "unlikePost": [
                2,
                {
                    "likeId": [
                        2,
                        "String!"
                    ],
                    "postId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Post": {
            "commentsCount": [
                7
            ],
            "createdAt": [
                3
            ],
            "id": [
                1
            ],
            "image": [
                2
            ],
            "likes": [
                4
            ],
            "likesCount": [
                7
            ],
            "location": [
                2
            ],
            "text": [
                2
            ],
            "updatedAt": [
                3
            ],
            "user": [
                12
            ],
            "userId": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Int": {},
        "Query": {
            "isUsernameAvailable": [
                9,
                {
                    "username": [
                        2,
                        "String!"
                    ]
                }
            ],
            "posts": [
                6,
                {
                    "pageNumber": [
                        7,
                        "Int!"
                    ]
                }
            ],
            "users": [
                12,
                {
                    "name": [
                        2,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Boolean": {},
        "Role": {},
        "SignUpInput": {
            "bio": [
                2
            ],
            "email": [
                2
            ],
            "name": [
                2
            ],
            "password": [
                2
            ],
            "username": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "User": {
            "bio": [
                2
            ],
            "createdAt": [
                3
            ],
            "email": [
                2
            ],
            "id": [
                1
            ],
            "image": [
                2
            ],
            "name": [
                2
            ],
            "role": [
                10
            ],
            "updatedAt": [
                3
            ],
            "username": [
                2
            ],
            "__typename": [
                2
            ]
        }
    }
}