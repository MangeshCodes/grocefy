# Grocefy Test Suite

This document describes the comprehensive test suite created for the Grocefy application.

## Test Files Created

### 1. Dashboard.test.jsx
**Location**: `src/pages/Dashboard.test.jsx`

**Test Coverage**:
- ✅ Customer Role Features
  - Dashboard rendering with customer features
  - Product browsing by default
  - View switching between browse and shops
  - Cart functionality and display
- ✅ Shop Management
  - Shop code modal functionality
  - Shop code validation (7-digit requirement)
  - Adding shops successfully
  - Displaying user shops in grid layout
- ✅ Geolocation Features
  - Nearby shops fetching
  - Location error handling
- ✅ Shopkeeper Role Features
  - Shopkeeper-specific dashboard features
- ✅ Error Handling
  - Loading states
  - API error handling
  - Empty states
- ✅ Modal Management
  - Shop code modal
  - Grocery list modal
  - Modal closing functionality

**Total Tests**: 22 test cases

### 2. TProductCard.test.jsx
**Location**: `src/components/TProductCard.test.jsx`

**Test Coverage**:
- ✅ Product Information Display
  - Product name, shop name, price display
  - Expiry date formatting
  - Image rendering with alt text
- ✅ User Interactions
  - Add to cart functionality
  - Conditional button rendering
- ✅ Error Handling
  - Image fallback on error
  - Missing props handling
- ✅ Data Formatting
  - Different date formats
  - Price formatting variations

**Total Tests**: 9 test cases

### 3. items.test.js
**Location**: `src/api/items.test.js`

**Test Coverage**:
- ✅ API Calls
  - Successful item fetching
  - Error handling
  - Environment variable usage
  - Empty response handling

**Total Tests**: 4 test cases

### 4. shops.test.js
**Location**: `src/api/shops.test.js`

**Test Coverage**:
- ✅ Add Shop to User
  - Successful shop addition
  - Invalid shop code handling
  - Network error handling
- ✅ Get Nearby Shops
  - Location-based shop fetching
  - Custom distance parameters
  - Location service errors
  - Empty results handling
- ✅ Get User Shops
  - User shop fetching
  - User not found errors
  - Unauthorized access handling
  - Empty shop lists

**Total Tests**: 11 test cases

## Running Tests

### Run All Tests
```bash
cd client
npm test -- --watchAll=false
```

### Run Specific Test Files
```bash
# Dashboard tests only
npm test Dashboard.test.jsx -- --watchAll=false

# Product Card tests only
npm test TProductCard.test.jsx -- --watchAll=false

# API tests only
npm test api/ -- --watchAll=false
```

### Run Tests with Coverage
```bash
npm test -- --coverage --watchAll=false
```

### Run Tests in Watch Mode (for development)
```bash
npm test
```

## Test Technologies Used

- **React Testing Library**: For component testing
- **Jest**: Test runner and assertions
- **User Event**: For user interaction simulation
- **Mocking**: API calls and browser APIs (localStorage, geolocation)

## Mock Setup

### API Mocks
- `items.js` - Mocked with jest.mock()
- `shops.js` - Mocked with jest.mock()
- `axios` - Fully mocked for API testing

### Browser API Mocks
- `localStorage` - Custom mock implementation
- `navigator.geolocation` - Mocked getCurrentPosition
- CSS imports - Mocked to prevent import errors

## Test Best Practices Implemented

1. **Isolation**: Each test is independent with proper cleanup
2. **Mocking**: External dependencies are properly mocked
3. **User-Centric**: Tests focus on user interactions and behaviors
4. **Error Coverage**: Both success and error scenarios are tested
5. **Accessibility**: Tests use accessible queries (getByText, getByRole)
6. **Async Handling**: Proper async/await and waitFor usage

## Expected Test Results

**Total Test Count**: 46 tests across 4 files

All tests should pass with:
- ✅ Component rendering
- ✅ User interactions
- ✅ API integrations
- ✅ Error handling
- ✅ Edge cases

## Troubleshooting

### Common Issues and Solutions

1. **Import Errors**: Make sure all dependencies are installed
2. **CSS Import Errors**: CSS files are mocked in test files
3. **Async Test Failures**: Use waitFor() for async operations
4. **API Mock Issues**: Ensure axios is properly mocked

### Debug Commands
```bash
# Verbose test output
npm test -- --verbose

# Run tests with debugging info
npm test -- --no-cache --verbose

# Check test file discovery
npx jest --listTests
```

## Next Steps

1. **Integration Tests**: Add tests for component integration
2. **E2E Tests**: Consider adding Cypress or Playwright tests
3. **Performance Tests**: Add performance testing for large data sets
4. **Visual Regression**: Consider adding visual testing
5. **API Integration**: Add tests with real API endpoints (staging)

---

**Note**: Run `npm test` to execute the test suite and verify all functionality works as expected.
