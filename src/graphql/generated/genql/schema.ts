import {FieldsSelection,Observable} from '@genql/runtime'

export type Scalars = {
    ID: string,
    String: string,
    DateTime: any,
    Int: number,
    Boolean: boolean,
}

export interface Comment {
    createdAt: Scalars['DateTime']
    id: Scalars['ID']
    post?: Post
    postId: Scalars['String']
    text: Scalars['String']
    updatedAt: Scalars['DateTime']
    user?: User
    userId: Scalars['String']
    __typename: 'Comment'
}

export interface Like {
    createdAt: Scalars['DateTime']
    id: Scalars['ID']
    post?: Post
    postId: Scalars['String']
    updatedAt: Scalars['DateTime']
    user?: User
    userId: Scalars['String']
    __typename: 'Like'
}

export interface Mutation {
    deleteComment?: Scalars['String']
    deletePost?: Scalars['String']
    likePost?: Like
    signUp?: User
    submitComment?: Scalars['String']
    submitPost?: Post
    unlikePost?: Scalars['String']
    __typename: 'Mutation'
}

export interface Post {
    commentsCount?: Scalars['Int']
    createdAt: Scalars['DateTime']
    id: Scalars['ID']
    image?: Scalars['String']
    likesCount?: Scalars['Int']
    location?: Scalars['String']
    text: Scalars['String']
    updatedAt: Scalars['DateTime']
    user?: User
    userId: Scalars['String']
    __typename: 'Post'
}

export interface Query {
    getPostComments: Comment[]
    getPostLikes: Like[]
    isUsernameAvailable: Scalars['Boolean']
    posts?: Post[]
    users?: User[]
    __typename: 'Query'
}

export type Role = 'admin' | 'user'

export interface User {
    bio: Scalars['String']
    createdAt: Scalars['DateTime']
    email: Scalars['String']
    id: Scalars['ID']
    image: Scalars['String']
    name: Scalars['String']
    role: Role
    updatedAt: Scalars['DateTime']
    username: Scalars['String']
    __typename: 'User'
}

export interface CommentRequest{
    createdAt?: boolean | number
    id?: boolean | number
    post?: PostRequest
    postId?: boolean | number
    text?: boolean | number
    updatedAt?: boolean | number
    user?: UserRequest
    userId?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface LikeRequest{
    createdAt?: boolean | number
    id?: boolean | number
    post?: PostRequest
    postId?: boolean | number
    updatedAt?: boolean | number
    user?: UserRequest
    userId?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationRequest{
    deleteComment?: [{commentId: Scalars['String'],postId: Scalars['String']}]
    deletePost?: [{postId: Scalars['String']}]
    likePost?: [{postId: Scalars['String']},LikeRequest]
    signUp?: [{image?: (Scalars['String'] | null),user: SignUpInput},UserRequest]
    submitComment?: [{postId: Scalars['String'],text: Scalars['String']}]
    submitPost?: [{image?: (Scalars['String'] | null),location?: (Scalars['String'] | null),text: Scalars['String']},PostRequest]
    unlikePost?: [{postId: Scalars['String']}]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface PostRequest{
    commentsCount?: boolean | number
    createdAt?: boolean | number
    id?: boolean | number
    image?: boolean | number
    likesCount?: boolean | number
    location?: boolean | number
    text?: boolean | number
    updatedAt?: boolean | number
    user?: UserRequest
    userId?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryRequest{
    getPostComments?: [{postId: Scalars['String']},CommentRequest]
    getPostLikes?: [{postId: Scalars['String']},LikeRequest]
    isUsernameAvailable?: [{username: Scalars['String']}]
    posts?: [{pageNumber: Scalars['Int']},PostRequest]
    users?: [{name: Scalars['String']},UserRequest]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface SignUpInput {bio: Scalars['String'],email: Scalars['String'],name: Scalars['String'],password: Scalars['String'],username: Scalars['String']}

export interface UserRequest{
    bio?: boolean | number
    createdAt?: boolean | number
    email?: boolean | number
    id?: boolean | number
    image?: boolean | number
    name?: boolean | number
    role?: boolean | number
    updatedAt?: boolean | number
    username?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


const Comment_possibleTypes: string[] = ['Comment']
export const isComment = (obj?: { __typename?: any } | null): obj is Comment => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isComment"')
  return Comment_possibleTypes.includes(obj.__typename)
}



const Like_possibleTypes: string[] = ['Like']
export const isLike = (obj?: { __typename?: any } | null): obj is Like => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isLike"')
  return Like_possibleTypes.includes(obj.__typename)
}



const Mutation_possibleTypes: string[] = ['Mutation']
export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
  return Mutation_possibleTypes.includes(obj.__typename)
}



const Post_possibleTypes: string[] = ['Post']
export const isPost = (obj?: { __typename?: any } | null): obj is Post => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isPost"')
  return Post_possibleTypes.includes(obj.__typename)
}



const Query_possibleTypes: string[] = ['Query']
export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
  return Query_possibleTypes.includes(obj.__typename)
}



const User_possibleTypes: string[] = ['User']
export const isUser = (obj?: { __typename?: any } | null): obj is User => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isUser"')
  return User_possibleTypes.includes(obj.__typename)
}


export interface CommentPromiseChain{
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Promise<Scalars['ID']>}),
    post: (PostPromiseChain & {get: <R extends PostRequest>(request: R, defaultValue?: (FieldsSelection<Post, R> | undefined)) => Promise<(FieldsSelection<Post, R> | undefined)>}),
    postId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    text: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    updatedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    user: (UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    userId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>})
}

export interface CommentObservableChain{
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Observable<Scalars['ID']>}),
    post: (PostObservableChain & {get: <R extends PostRequest>(request: R, defaultValue?: (FieldsSelection<Post, R> | undefined)) => Observable<(FieldsSelection<Post, R> | undefined)>}),
    postId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    text: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    updatedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    user: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    userId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>})
}

export interface LikePromiseChain{
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Promise<Scalars['ID']>}),
    post: (PostPromiseChain & {get: <R extends PostRequest>(request: R, defaultValue?: (FieldsSelection<Post, R> | undefined)) => Promise<(FieldsSelection<Post, R> | undefined)>}),
    postId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    updatedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    user: (UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    userId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>})
}

export interface LikeObservableChain{
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Observable<Scalars['ID']>}),
    post: (PostObservableChain & {get: <R extends PostRequest>(request: R, defaultValue?: (FieldsSelection<Post, R> | undefined)) => Observable<(FieldsSelection<Post, R> | undefined)>}),
    postId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    updatedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    user: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    userId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>})
}

export interface MutationPromiseChain{
    deleteComment: ((args: {commentId: Scalars['String'],postId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    deletePost: ((args: {postId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    likePost: ((args: {postId: Scalars['String']}) => LikePromiseChain & {get: <R extends LikeRequest>(request: R, defaultValue?: (FieldsSelection<Like, R> | undefined)) => Promise<(FieldsSelection<Like, R> | undefined)>}),
    signUp: ((args: {image?: (Scalars['String'] | null),user: SignUpInput}) => UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    submitComment: ((args: {postId: Scalars['String'],text: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    submitPost: ((args: {image?: (Scalars['String'] | null),location?: (Scalars['String'] | null),text: Scalars['String']}) => PostPromiseChain & {get: <R extends PostRequest>(request: R, defaultValue?: (FieldsSelection<Post, R> | undefined)) => Promise<(FieldsSelection<Post, R> | undefined)>}),
    unlikePost: ((args: {postId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>})
}

export interface MutationObservableChain{
    deleteComment: ((args: {commentId: Scalars['String'],postId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    deletePost: ((args: {postId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    likePost: ((args: {postId: Scalars['String']}) => LikeObservableChain & {get: <R extends LikeRequest>(request: R, defaultValue?: (FieldsSelection<Like, R> | undefined)) => Observable<(FieldsSelection<Like, R> | undefined)>}),
    signUp: ((args: {image?: (Scalars['String'] | null),user: SignUpInput}) => UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    submitComment: ((args: {postId: Scalars['String'],text: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    submitPost: ((args: {image?: (Scalars['String'] | null),location?: (Scalars['String'] | null),text: Scalars['String']}) => PostObservableChain & {get: <R extends PostRequest>(request: R, defaultValue?: (FieldsSelection<Post, R> | undefined)) => Observable<(FieldsSelection<Post, R> | undefined)>}),
    unlikePost: ((args: {postId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>})
}

export interface PostPromiseChain{
    commentsCount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Promise<(Scalars['Int'] | undefined)>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Promise<Scalars['ID']>}),
    image: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    likesCount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Promise<(Scalars['Int'] | undefined)>}),
    location: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Promise<(Scalars['String'] | undefined)>}),
    text: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    updatedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    user: (UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Promise<(FieldsSelection<User, R> | undefined)>}),
    userId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>})
}

export interface PostObservableChain{
    commentsCount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Observable<(Scalars['Int'] | undefined)>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Observable<Scalars['ID']>}),
    image: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    likesCount: ({get: (request?: boolean|number, defaultValue?: (Scalars['Int'] | undefined)) => Observable<(Scalars['Int'] | undefined)>}),
    location: ({get: (request?: boolean|number, defaultValue?: (Scalars['String'] | undefined)) => Observable<(Scalars['String'] | undefined)>}),
    text: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    updatedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    user: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R> | undefined)) => Observable<(FieldsSelection<User, R> | undefined)>}),
    userId: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>})
}

export interface QueryPromiseChain{
    getPostComments: ((args: {postId: Scalars['String']}) => {get: <R extends CommentRequest>(request: R, defaultValue?: FieldsSelection<Comment, R>[]) => Promise<FieldsSelection<Comment, R>[]>}),
    getPostLikes: ((args: {postId: Scalars['String']}) => {get: <R extends LikeRequest>(request: R, defaultValue?: FieldsSelection<Like, R>[]) => Promise<FieldsSelection<Like, R>[]>}),
    isUsernameAvailable: ((args: {username: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    posts: ((args: {pageNumber: Scalars['Int']}) => {get: <R extends PostRequest>(request: R, defaultValue?: (FieldsSelection<Post, R>[] | undefined)) => Promise<(FieldsSelection<Post, R>[] | undefined)>}),
    users: ((args: {name: Scalars['String']}) => {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R>[] | undefined)) => Promise<(FieldsSelection<User, R>[] | undefined)>})
}

export interface QueryObservableChain{
    getPostComments: ((args: {postId: Scalars['String']}) => {get: <R extends CommentRequest>(request: R, defaultValue?: FieldsSelection<Comment, R>[]) => Observable<FieldsSelection<Comment, R>[]>}),
    getPostLikes: ((args: {postId: Scalars['String']}) => {get: <R extends LikeRequest>(request: R, defaultValue?: FieldsSelection<Like, R>[]) => Observable<FieldsSelection<Like, R>[]>}),
    isUsernameAvailable: ((args: {username: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    posts: ((args: {pageNumber: Scalars['Int']}) => {get: <R extends PostRequest>(request: R, defaultValue?: (FieldsSelection<Post, R>[] | undefined)) => Observable<(FieldsSelection<Post, R>[] | undefined)>}),
    users: ((args: {name: Scalars['String']}) => {get: <R extends UserRequest>(request: R, defaultValue?: (FieldsSelection<User, R>[] | undefined)) => Observable<(FieldsSelection<User, R>[] | undefined)>})
}

export interface UserPromiseChain{
    bio: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    email: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Promise<Scalars['ID']>}),
    image: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    name: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    role: ({get: (request?: boolean|number, defaultValue?: Role) => Promise<Role>}),
    updatedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Promise<Scalars['DateTime']>}),
    username: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>})
}

export interface UserObservableChain{
    bio: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    createdAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    email: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    id: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Observable<Scalars['ID']>}),
    image: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    name: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    role: ({get: (request?: boolean|number, defaultValue?: Role) => Observable<Role>}),
    updatedAt: ({get: (request?: boolean|number, defaultValue?: Scalars['DateTime']) => Observable<Scalars['DateTime']>}),
    username: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>})
}