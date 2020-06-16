Feature: Display Home Page

	Scenario: User visits website
		Given I am on the homepage
		Then I should see a page with the title "Welcome to Chasebox!"
		And a link with the words "Learn More" pointing to "https://github.com/a-n-u-b-i-s/chasebox/"