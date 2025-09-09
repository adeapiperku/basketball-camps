# Basketball Camps Management System

A comprehensive Spring Boot application for managing basketball camps, student registrations, and payments.

## Features

### For Students/Participants
- ✅ User registration and login
- ✅ Browse available basketball camps
- ✅ View camp details, images, and requirements
- ✅ Choose training school
- ✅ Register for camps with payment options
- ✅ Support for both Stripe (credit card) and cash payments

### For Coaches
- ✅ View assigned camps
- ✅ See registered participants for each camp
- ✅ Access participant details (contact info, skill level, etc.)
- ✅ Dashboard with camp statistics

### For Administrators
- ✅ Complete system overview dashboard
- ✅ View all camps, schools, registrations, and payments
- ✅ Monitor revenue and registration statistics
- ✅ Manage all system data

## Technology Stack

- **Backend**: Spring Boot 3.5.4, Spring Security, Spring Data JPA
- **Database**: MySQL
- **Payment Processing**: Stripe API
- **Frontend**: HTML, CSS, JavaScript (responsive design)
- **Build Tool**: Maven
- **Java Version**: 17

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Stripe account (for payment processing)

## Setup Instructions

### 1. Database Setup

Create a MySQL database:
```sql
CREATE DATABASE basketball_camps;
```

Update the database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/basketball_camps?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Stripe Configuration

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Update the Stripe configuration in `application.properties`:
```properties
stripe.secret-key=sk_test_your_actual_stripe_secret_key
stripe.publishable-key=pk_test_your_actual_stripe_publishable_key
```

### 3. Application Configuration

Update the base URL in `application.properties`:
```properties
app.base-url=http://localhost:8080
```

### 4. Build and Run

```bash
# Navigate to the project directory
cd basketball-camps

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will be available at `http://localhost:8080`

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /api/camps/public` - Get all active camps
- `GET /api/camps/public/available` - Get available camps for registration
- `GET /api/camps/public/{id}` - Get camp details
- `GET /api/camps/public/search?q={term}` - Search camps
- `GET /api/schools/public` - Get all active schools
- `POST /api/auth/register` - Register a new participant
- `POST /api/auth/payment/confirm` - Confirm Stripe payment

### Coach Endpoints (Requires COACH or ADMIN role)
- `GET /api/coach/camps` - Get coach's assigned camps
- `GET /api/coach/camps/{campId}/participants` - Get camp participants
- `GET /api/coach/dashboard` - Get coach dashboard data

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/camps` - Get all camps
- `GET /api/admin/schools` - Get all schools
- `GET /api/admin/registrations` - Get all registrations
- `GET /api/admin/payments` - Get all payments

## Database Schema

The application uses the following main entities:

- **UserAccount** (Base class for all users)
  - **Participant** (Students)
  - **Coach** (Camp instructors)
  - **Admin** (System administrators)

- **Camp** (Basketball camps)
- **School** (Training schools)
- **Registration** (Camp registrations)
- **Payment** (Payment records)

## Usage Examples

### Register a Participant
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "birthDate": "2005-06-15",
    "phoneNumber": "+1234567890",
    "schoolId": 1,
    "campId": 1,
    "paymentMethod": "STRIPE",
    "skillLevel": "Intermediate"
  }'
```

### Get Available Camps
```bash
curl http://localhost:8080/api/camps/public/available
```

## Security Features

- Role-based access control (PARTICIPANT, COACH, ADMIN)
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Secure payment processing with Stripe

## File Structure

```
src/
├── main/
│   ├── java/com/basketball_camps/
│   │   ├── controller/          # REST controllers
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── model/              # JPA entities
│   │   ├── repository/         # Data repositories
│   │   ├── security/           # Security configuration
│   │   └── service/            # Business logic
│   └── resources/
│       ├── static/             # Frontend files
│       └── application.properties
```

## Development Notes

- The application uses JPA with Hibernate for database operations
- All entities extend `BaseEntity` for common fields (id, createdOn, updatedOn)
- Validation groups are used for different validation scenarios
- The frontend is a single-page application with responsive design
- Stripe integration supports both test and production environments

## Testing

To test the application:

1. Start the application
2. Open `http://localhost:8080` in your browser
3. Browse available camps
4. Register a new participant
5. Test payment flow (use Stripe test cards)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
