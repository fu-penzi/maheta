import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

import { ThemeClassEnum, ThemeService } from '@src/app/modules/layout/services/theme.service';
import { MahetaDialogService } from '@src/app/services/maheta-dialog.service';
import { NavigationService } from '@src/app/services/navigation.service';

@Component({
  selector: 'maheta-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public playerSheetOpen: boolean = false;

  constructor(
    private themeService: ThemeService,
    private navigationService: NavigationService,
    private mahetaDialogService: MahetaDialogService
  ) {}

  public get themeClass(): ThemeClassEnum {
    return this.themeService.theme;
  }

  public ngOnInit(): void {
    this.navigationService.restoreRouterHistory().then(() => {
      this.mahetaDialogService.closeLoadingDialog();
      SplashScreen.hide();
      this.navigationService.overlayOpen$.subscribe((isOpen: boolean) => {
        this.playerSheetOpen = isOpen;
      });
    });
  }
}
