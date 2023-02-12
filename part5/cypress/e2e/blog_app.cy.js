describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'test user',
      username: 'tester',
      password: 'testerpassword'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  describe('login functionality', function() {
    it('front page can be opened', function() {
      cy.contains('The Blogosphere')
      cy.contains('All blogs(title, author, likes)')
    })
    it('login form can be opened', function() {
      cy.contains('login').click()
    })
    it('user can login', function() {
      cy.contains('login').click()
      cy.get('#username-input').type('tester')
      cy.get('#password-input').type('testerpassword')
      cy.get('#login-button').click()
      cy.contains('test user logged in')
    })
    it('login fails with wrong password', function() {
      cy.contains('login').click()
      cy.get('#username-input').type('mluukkai')
      cy.get('#password-input').type('wrong')
      cy.get('#login-button').click()
      cy.get('.errorMessage')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'test user logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: 'testerpassword' })
    })
    it('a new blog can be created', function() {
      cy.contains('Add a blog').click()
      cy.get('#newAuthorInput').type('Author Test')
      cy.get('#newTitleInput').type('Title Test')
      cy.get('#newUrlInput').type('Url Test')
      cy.get('#newLikesInput').type('10')
      cy.contains('Save').click()
      cy.contains('Author Test')
      cy.contains('Title Test')
      cy.contains('Url Test')
      cy.contains('10')
    })
  })
  describe('and a blog exists', function() {
    beforeEach(function () {
      cy.createBlog({
        author: 'Another test author',
        title: 'Another test title',
        url: 'Another test title',
        likes: '99'
      })
    })
  })
})