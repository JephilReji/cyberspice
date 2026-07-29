export default function Footer() {
  return (
    <footer className="hidden md:block bg-surface-container border-t border-outline-variant py-xl mt-lg">
      <div className="max-w-container-max mx-auto px-lg grid grid-cols-4 gap-lg">
        <div className="col-span-1">
          <div className="text-headline-md font-headline-md font-bold text-primary mb-md">CyberSpice</div>
          <p className="text-body-sm text-secondary">
            Asia's trusted marketplace for bulk spice and agricultural commodities trading.
          </p>
        </div>
        <div>
          <h4 className="text-label-caps text-primary mb-md uppercase">Trade</h4>
          <ul className="space-y-sm text-body-sm text-secondary">
            <li><a className="hover:text-primary transition-colors" href="#">Market Index</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Bulk Purchasing</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Selling Spices</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-label-caps text-primary mb-md uppercase">Contact</h4>
          <ul className="space-y-sm text-body-sm text-secondary">
            <li><a className="hover:text-primary transition-colors" href="mailto:support@cyberspice.com">support@cyberspice.com</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Global Trade Hotline</a></li>
            <li className="flex gap-sm mt-md">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary">language</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary">verified_user</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-lg mt-xl pt-md border-t border-outline-variant text-center text-label-md text-outline">
        © 2026 CyberSpice by Jephil Rejimon.
      </div>
    </footer>
  );
}