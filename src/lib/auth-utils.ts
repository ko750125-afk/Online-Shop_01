import { MASTER_CREDENTIALS } from './constants';

export const MASTER_ADMIN_COOKIE = 'rf_master_admin';

/**
 * 클라이언트 측에서 마스터 관리자 여부 확인
 */
export function checkIsMasterClient(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes(`${MASTER_ADMIN_COOKIE}=true`);
}

/**
 * 마스터 관리자 로그아웃 처리 (쿠키 삭제)
 */
export function clearMasterAdminCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${MASTER_ADMIN_COOKIE}=; path=/; max-age=0`;
}

/**
 * 마스터 관리자 가상 유저 객체 생성
 */
export function getMasterUser() {
  return {
    id: 'master-admin',
    email: MASTER_CREDENTIALS.email,
    isMaster: true,
  };
}
