import MoviesDAO from "../src/dao/moviesDAO"

describe("Paging", async () => {
  beforeAll(async () => {
    await MoviesDAO.injectDB(global.mflixClient)
  })

  test("Supports paging by cast", async () => {
    const filters = { cast: ["Natalie Portman"] }
    /**
     * Testing first page
     */
    const { moviesList: firstPage, totalNumMovies } = await MoviesDAO.getMovies(
      {
        filters,
      },
    )

    // check the total number of movies, including both pages
    expect(totalNumMovies).toEqual(29)

    // check the number of movies on the first page
    expect(firstPage.length).toEqual(20)

    // check some of the movies on the second page
    const firstMovie = firstPage[0]
    const twentiethMovie = firstPage.slice(-1).pop()
    expect(firstMovie.title).toEqual(
      "Star Wars: Episode III - Revenge of the Sith",
    )
    expect(twentiethMovie.title).toEqual("Hotel Chevalier")

    /**
     * Testing second page
     */
    const { moviesList: secondPage } = await MoviesDAO.getMovies({
      filters,
      page: 1,
    })

    // check the number of movies on the second page
    expect(secondPage.length).toEqual(9)
    // check some of the movies on the second page
    const twentyFirstMovie = secondPage[0]
    const fortiethMovie = secondPage.slice(-1).pop()
    expect(twentyFirstMovie.title).toEqual("Jane Got a Gun")
    expect(fortiethMovie.title).toEqual("Planetarium")
  })

  test("Supports paging by genre", async () => {
    const filters = { genre: ["Comedy", "Drama"] }

    /**
     * Testing first page
     */
    const { moviesList: firstPage, totalNumMovies } = await MoviesDAO.getMovies(
      {
        filters,
      },
    )

    // check the total number of movies, including both pages
    expect(totalNumMovies).toEqual(31675)

    // check the number of movies on the first page
    expect(firstPage.length).toEqual(20)

    // check some of the movies on the second page
    const firstMovie = firstPage[0]
    const twentiethMovie = firstPage.slice(-1).pop()
    expect(firstMovie.title).toEqual("Titanic")
    expect(twentiethMovie.title).toEqual("Dègkeselyè")

    /**
     * Testing second page
     */
    const { moviesList: secondPage } = await MoviesDAO.getMovies({
      filters,
      page: 1,
    })

    // check the number of movies on the second page
    expect(secondPage.length).toEqual(20)
    // check some of the movies on the second page
    const twentyFirstMovie = secondPage[0]
    const fortiethMovie = secondPage.slice(-1).pop()
    expect(twentyFirstMovie.title).toEqual("8 Mile")
    expect(fortiethMovie.title).toEqual("Forrest Gump")
  })

  test("Supports paging by text", async () => {
    const filters = { text: "countdown" }

    /**
     * Testing first page
     */
    const { moviesList: firstPage, totalNumMovies } = await MoviesDAO.getMovies(
      {
        filters,
      },
    )

    // check the total number of movies, including both pages
    expect(totalNumMovies).toEqual(24)

    // check the number of movies on the first page
    expect(firstPage.length).toEqual(20)

    // check some of the movies on the second page
    const firstMovie = firstPage[0]
    const twentiethMovie = firstPage.slice(-1).pop()
    expect(firstMovie.title).toEqual(
      "VeggieTales: The Ultimate Silly Song Countdown",
    )
    expect(twentiethMovie.title).toEqual("A Good Day to Die Hard")

    /**
     * Testing second page
     */
    const { moviesList: secondPage } = await MoviesDAO.getMovies({
      filters,
      page: 1,
    })

    // check the number of movies on the second page
    expect(secondPage.length).toEqual(4)
    // check some of the movies on the second page
    const twentyFirstMovie = secondPage[0]
    const fortiethMovie = secondPage.slice(-1).pop()
    expect(twentyFirstMovie.title).toEqual("New Year's Evil")
    expect(fortiethMovie.title).toEqual("The Peacekeeper")
  })
})
