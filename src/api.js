const BASE = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, options)

    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Request failed (${res.status})`)
    }

    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return null
    }

    return res.json()
}

function post(path, body) {
    return request(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
}

// Users
export const createUser = (username, handle) => post('/api/users', { username, handle })
export const getUserByHandle = (handle) => request(`/api/users/${handle}`)

// Posts
export const createPost = (authorId, content) => post('/api/posts', { authorId, content })
export const getFeed = (userId) => request(`/api/posts/feed/${userId}`)

// Follows
export const follow = (followerId, followedId) =>
    request(`/api/users/${followerId}/follow/${followedId}`, { method: 'POST' })

export const unfollow = (followerId, followedId) =>
    request(`/api/users/${followerId}/follow/${followedId}`, { method: 'DELETE' })

export const getFollowing = (userId) => request(`/api/users/${userId}/following`)
export const getFollowers = (userId) => request(`/api/users/${userId}/followers`)
export const getFollowCounts = (userId) => request(`/api/users/${userId}/follow-counts`)

export const searchUsers = (q) => request(`/api/users/search?q=${encodeURIComponent(q)}`)