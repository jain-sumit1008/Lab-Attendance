export default function InfoStrip({ labInfo }) {
  return (
    <div className="info-strip">
      <span>Lab: <b>{labInfo.lab}</b></span>
      <span>Course: <b>{labInfo.course}</b></span>
      <span>Batch: <b>{labInfo.batch}</b></span>
      <span>Date: <b>{labInfo.date}</b></span>
      <span>Time: <b>{labInfo.time}</b></span>
    </div>
  );
}