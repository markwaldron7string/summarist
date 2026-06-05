describe('Summarist guest login', () => {
  it('logs in as a guest and lands on the For You page', () => {
    cy.visit('/')
    cy.contains(/login/i).first().click()
    cy.contains('Login as a Guest').click()
    cy.url().should('include', '/for-you')
  })

  it('reaches an authenticated For You page after guest login', () => {
    cy.visit('/')
    cy.contains(/login/i).first().click()
    cy.contains('Login as a Guest').click()
    cy.url().should('include', '/for-you')
    cy.contains('Recommended For You').should('be.visible')
  })
})
