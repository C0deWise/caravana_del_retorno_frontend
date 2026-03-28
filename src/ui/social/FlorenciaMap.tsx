export default function FlorenciaMap() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.0970598463127!2d-77.07293299999999!3d1.6830614999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2f044495fb4d39%3A0x68adaff44d74ed82!2sFlorencia%2C%20Cauca!5e0!3m2!1ses!2sco!4v1773015079612!5m2!1ses!2sco"
        className="w-full h-full"
        style={{ border: 0 }}
        loading="lazy"
      ></iframe>
    </div>
  );
}
