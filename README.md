# Property Listings Web Application

## Overview

This project is a web application designed to display property listings, allow users to search and filter properties, manage favorites, and handle user profiles and transactions. The application uses modern web technologies to ensure a responsive and user-friendly experience.

## Tools and Technologies

### Front-End
- **HTML5**: Used for structuring the web pages.
- **Tailwind CSS**: Utilized for styling the application with a utility-first CSS framework.
- **Font Awesome**: Integrated for iconography.
- **JavaScript**: Implemented for interactive functionality, such as managing favorite buttons and handling user interactions.

### Local Storage
- **Local Storage**: Used for managing user favorites and maintaining state across page reloads.

## Key Features

1. **User Details Form**: Allows users to enter their details when prompted.
2. **Property Listings**: Displays properties on the home page and allows users to view details on a separate page.
3. **Search and Filter**: Users can search for properties and apply filters based on name, location, and price.
4. **Favorites Management**: Users can mark properties as favorites, and the state is persisted using local storage.
5. **User Profile and Transaction Review**: Allows users to view their profile and review transactions.

## Challenges and Solutions

### 1. Synchronizing Favorite Button State
**Challenge**: The favorite button state was not consistent across different pages and was not being updated correctly.

**Solution**: Implemented JavaScript to manage the favorite button state across pages. Used local storage to persist favorite properties and updated the button's appearance based on its state. Added `data-id` attributes to uniquely identify properties and manage their favorite status.

### 2. Dynamic Content Loading
**Challenge**: Dynamically inserting property cards and managing their state was complex.

**Solution**: Used JavaScript to dynamically insert property cards into the DOM. Managed the state and content using JavaScript functions and ensured that data was properly loaded and displayed on page transitions.

### 3. Filter Popup Visibility
**Challenge**: Ensuring that the filter popup appears and behaves correctly when toggled.

**Solution**: Used Tailwind CSS classes to manage the visibility of the filter popup and implemented JavaScript to toggle these classes based on user interactions.


## Running the Project Locally

To run this project locally, follow these steps:

1. **Clone the Repository**

   If you haven’t already, clone the repository to your local machine:

   ```bash
   git clone <repository-url>

2. **Navigate to the Project Directory**

   Change to the project directory:

   ```bash
   cd property-listings

3. **Open the Project**

- Open index.html in your preferred browser.You can do this by either:

- Dragging and dropping the index.html file into your browser.

- Using a local server to serve the files. If you have Python installed, you can run a simple HTTP server with:

    ```bash
    python -m http.server 8000
- Then, navigate to http://localhost:8000 in your browser.

4. **Modify Styles and Scripts**

- **Custom Styles**: Edit styles.css to update custom styles.
- **JavaScript**: Modify main.js to update JavaScript functionality.

5. **Testing Changes**

- Make sure to test the changes in different browsers to ensure compatibility.
- Check for responsiveness on various devices.

    **OR**
**Navigate to Deployed site**
  ```bash
   https://circlepe-assign.vercel.app/
## Future Enhancements
- **Improved Accessibility**: Enhance the application’s accessibility to ensure it is usable by people with disabilities.
- **Performance Optimization**: Optimize loading times and performance, especially for dynamic content.
- **Integration with APIs**: Consider integrating with external APIs for real-time property data and updates.
- **Back-End Integration**: Implement a back-end with Node.js to handle data persistence and user authentication.
- **Database**: Integrate a database to store property listings, user details, and favorite properties.
- **Advanced Filtering**: Improve the filter functionality with more advanced options and user-friendly interface elements.

## Conclusion

This project demonstrates the use of modern web technologies to build a dynamic property listing application. The challenges faced were addressed through careful planning and implementation of JavaScript and CSS strategies to ensure a seamless user experience.
