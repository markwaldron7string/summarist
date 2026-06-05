describe('Summarist navigation and content', () => {
  it('loads the landing page', () => {
    cy.visit('/')
    cy.contains(/summarist/i).should('be.visible')
  })

  it('loads the For You page with its sections', () => {
    cy.visit('/for-you')
    // These headings render in both loading and loaded states.
    cy.contains('Selected just for you').should('be.visible')
    cy.contains('Recommended For You').should('be.visible')
    cy.contains('Suggested Books').should('be.visible')
  })

  it('loads book data from the API and renders book cards', () => {
    cy.visit('/for-you')
    // Wait for the skeletons to be replaced by real book content.
    // The selected book becomes clickable once loaded; book cards appear.
    cy.get('.book-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
  })

  it('navigates to a book detail page when a book is clicked', () => {
    cy.visit('/for-you')
    // Wait for a REAL book card (skeletons reuse .book-card but have no <img>).
    // Targeting the card that contains an image guarantees it's loaded and clickable.
    cy.get('.book-card img', { timeout: 15000 }).should('be.visible')
    cy.get('.book-card').filter(':has(img)').first().click()
    cy.url().should('include', '/book/')
  })

  it('loads the library page', () => {
    cy.visit('/library')
  })
})