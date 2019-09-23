import MoviesDAO from "../src/dao/moviesDAO"

describe("Get Comments", async () => {
  beforeAll(async () => {
    await MoviesDAO.injectDB(global.mflixClient)
  })

  test("Can fetch comments for a movie", async () => {
    const id = "573a13a6f29313caabd17bd5"
    const movie = await MoviesDAO.getMovieByID(id)
    expect(movie.title).toEqual("Once Upon a Time in Mexico")
    expect(movie.comments.length).toBe(2)
  })

  test("comments should be sorted by date", async () => {
    // most recent to least
    expect.assertions(24)
    const movieIds = [
      "573a1391f29313caabcd8414",
      "573a1391f29313caabcd9058",
      "573a1391f29313caabcd91ed",
      "573a1392f29313caabcd9d4f",
      "573a1392f29313caabcdae3d",
      "573a1392f29313caabcdb40b",
      "573a1392f29313caabcdb585",
      "573a1393f29313caabcdbe7c",
      "573a1393f29313caabcdd6aa",
    ]
    const promises = movieIds.map(async id => {
      const movie = await MoviesDAO.getMovieByID(id)
      const comments = movie.comments
      const sortedComments = comments.slice()
      sortedComments.sort((a, b) => b.date.getTime() - a.date.getTime())

      for (let i = 0; i < Math.min(10, comments.length); i++) {
        const randomInt = Math.floor(Math.random() * comments.length - 1)
        expect(comments[randomInt]).toEqual(sortedComments[randomInt])
      }
    })
    await Promise.all(promises)
  })
})
