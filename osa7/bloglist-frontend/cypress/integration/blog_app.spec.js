describe('Blog', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Vilho',
            username: 'vipsu',
            password: 'salasana',
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })
    it('Login form is shown', function () {
        cy.contains('Login')
        cy.contains('username')
        cy.contains('password')
    })
    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username').type('vipsu')
            cy.get('#password').type('salasana')
            cy.get('#login-button').click()
            cy.contains('Vilho logged in')
        })
        it('fails with wrong credentials', function () {
            cy.get('#username').type('vipsu')
            cy.get('#password').type('vääräsalasana')
            cy.get('#login-button').click()
            cy.contains('wrong username or password')
        })
    })
    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'vipsu', password: 'salasana' })
        })
        it('a blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#title').type('a blog created for testing')
            cy.get('#author').type('Vilho')
            cy.get('#url').type('vilhonblogi.com')
            cy.get('#create-button').click()
            cy.contains('a blog created for testing Vilho')
        })
        it('a user can like a blog', function () {
            cy.createBlog({
                title: 'another blog for testing',
                author: 'Vilho',
                url: 'vilhonblogi.com',
            })
            cy.contains('view').click()
            cy.contains('like').click()
        })
        it('user can remove their own blog', function () {
            cy.createBlog({
                title: 'another blog for testing',
                author: 'Vilho',
                url: 'vilhonblogi.com',
            })
            cy.contains('view').click()
            cy.contains('remove').click()
            cy.get('html').should('not.contain', 'another blog for testing')
        })
    })
})