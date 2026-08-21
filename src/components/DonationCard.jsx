function DonationCard({ name, amount, message }) {
  return (
    <div className="donation-card">

      <div className="donor-icon">
        🙏
      </div>

      <div className="donor-info">
        <h3>{name}</h3>

        <p>
          {message}
        </p>
      </div>

      <div className="donation-amount">
        ₹{amount}
      </div>

    </div>
  );
}

export default DonationCard;